import React, { useState, useEffect } from 'react';
import { Modal, Text, Group, Badge, Tabs, Timeline, Textarea, Button, Stack, Paper, SimpleGrid } from '@mantine/core';
import api from '../../services/api';

export const ProjectDetailModal = ({ isOpen, onClose, project: initialProject, onUpdate }) => {
    const [project, setProject] = useState(initialProject);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialProject?.id) {
            fetchFullProject(initialProject.id);
        }
    }, [initialProject]);

    const fetchFullProject = async (id) => {
        // setLoading(true); // Avoid sync state update in effect
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
            setNotes(res.data.technicalNotes || '');
        } catch (err) {
            console.error('Error fetching project full data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotes = async () => {
        try {
            const res = await api.patch(`/projects/${project.id}`, { technicalNotes: notes });
            setProject(prev => ({ ...prev, technicalNotes: res.data.technicalNotes }));
            onUpdate?.();
        } catch (err) {
            console.error('Error saving notes:', err);
        }
    };

    const handleAddActivity = async (action, details) => {
        try {
            await api.post(`/projects/${project.id}/activities`, { action, details });
            fetchFullProject(project.id);
            onUpdate?.();
        } catch (err) {
            console.error('Error adding activity:', err);
        }
    };

    if (!project) return null;

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={
                <Group gap="sm">
                    <Text fw={700} size="lg" className="text-petroleum-900">Projeto: {project.name}</Text>
                    <Badge color="blue" variant="light">PRJ-{project.id.substring(0, 4).toUpperCase()}</Badge>
                </Group>
            }
            size="xl"
            radius="md"
        >
            <Tabs defaultValue="info" color="petroleum" className="mt-4">
                <Tabs.List>
                    <Tabs.Tab value="info" leftSection={<span className="material-symbols-outlined text-[18px]">info</span>}>Informações</Tabs.Tab>
                    <Tabs.Tab value="technical" leftSection={<span className="material-symbols-outlined text-[18px]">engineering</span>}>Dados Técnicos</Tabs.Tab>
                    <Tabs.Tab value="timeline" leftSection={<span className="material-symbols-outlined text-[18px]">history</span>}>Linha do Tempo</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="info" pt="md">
                    <SimpleGrid cols={2} spacing="md">
                        <Paper withBorder p="md" radius="md" className="bg-slate-50/50">
                            <Text size="xs" fw={700} c="dimmed" className="uppercase tracking-widest mb-2">Detalhes do Cliente</Text>
                            <Stack gap="xs">
                                <div>
                                    <Text size="xs" fw={600} c="dimmed">Nome</Text>
                                    <Text size="sm" fw={700}>{project.lead?.name}</Text>
                                </div>
                                <div>
                                    <Text size="xs" fw={600} c="dimmed">Localização</Text>
                                    <Text size="sm">{project.lead?.location}</Text>
                                </div>
                                <div>
                                    <Text size="xs" fw={600} c="dimmed">Consumo Médio</Text>
                                    <Text size="sm">{project.lead?.consumption} kWh/mês</Text>
                                </div>
                            </Stack>
                        </Paper>

                        <Paper withBorder p="md" radius="md" className="bg-slate-50/50">
                            <Text size="xs" fw={700} c="dimmed" className="uppercase tracking-widest mb-2">Dados da Instalação</Text>
                            <Stack gap="xs">
                                <div>
                                    <Text size="xs" fw={600} c="dimmed">Status Atual</Text>
                                    <Badge color="cyan" variant="filled" size="sm" mt={3}>{project.status}</Badge>
                                </div>
                                <div>
                                    <Text size="xs" fw={600} c="dimmed">Técnico Responsável</Text>
                                    <Text size="sm" fw={700}>{project.technician?.name || 'Não atribuído'}</Text>
                                </div>
                            </Stack>
                        </Paper>
                    </SimpleGrid>
                </Tabs.Panel>

                <Tabs.Panel value="technical" pt="md">
                    <Stack gap="md">
                        <div>
                            <Text size="sm" fw={700} className="text-petroleum-900 mb-2">Notas Técnicas e Observações</Text>
                            <Textarea
                                placeholder="Descreva observações da vistoria, dificuldades técnicas ou requisitos de instalação..."
                                minRows={6}
                                value={notes}
                                onChange={(e) => setNotes(e.currentTarget.value)}
                                className="font-sans"
                            />
                            <Button
                                color="petroleum"
                                size="xs"
                                mt="sm"
                                onClick={handleSaveNotes}
                                leftSection={<span className="material-symbols-outlined text-[16px]">save</span>}
                            >
                                Salvar Notas
                            </Button>
                        </div>

                        <Paper withBorder p="md" radius="md" className="bg-amber-50/30 border-amber-100">
                            <Text size="sm" fw={700} className="text-amber-900 mb-1">Ações Rápidas</Text>
                            <Group gap="xs" mt="sm">
                                <Button variant="outline" color="amber" size="xs" onClick={() => handleAddActivity('SURVEY', 'Vistoria técnica realizada no local.')}>Registrar Vistoria</Button>
                                <Button variant="outline" color="amber" size="xs" onClick={() => handleAddActivity('PHOTO', 'Novas fotos da cobertura anexadas.')}>Anexar Fotos</Button>
                            </Group>
                        </Paper>
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="timeline" pt="md">
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <Timeline active={0} bulletSize={24} lineWidth={2}>
                            {project.activities?.map((activity, idx) => (
                                <Timeline.Item
                                    key={activity.id}
                                    bullet={<span className="material-symbols-outlined text-[14px]">{activity.action === 'CREATE' ? 'add' : 'update'}</span>}
                                    title={activity.action}
                                    className="text-slate-700"
                                >
                                    <Text size="sm" mt={4}>{activity.details}</Text>
                                    <Text size="xs" c="dimmed" mt={4}>
                                        {new Date(activity.createdAt).toLocaleString('pt-BR')}
                                    </Text>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </div>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
};
